<script>
/* global ReqJSON, SvelteFa, tinydate, Prism, debounce, querystring */
import {
  faAngleDown,
  faTimesCircle,
  faExclamationCircle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

const Fa = SvelteFa;
const {
  body,
  documentElement,
} = document;
const {
  assign,
  keys,
} = Object;
const queryLogs = (new ReqJSON()).resource('logs').get;
const levels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10,
};
const levelIcons = {
  60: faTimesCircle,
  50: faTimesCircle,
  40: faExclamationCircle,
  30: faInfoCircle,
  20: faInfoCircle,
  10: faInfoCircle,
};
const levelsMapping = {};
keys(levels).map((name) => {
  levelsMapping[levels[name]] = name.toUpperCase();
});
const formatLevel = (code) => {
  const level = levelsMapping[`${code}`];
  return `${level}${'     '.substr(level.length)}`;
};
const formatDate = tinydate('{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}.{fff}');
const formatTimestamp = timestamp => formatDate(new Date(parseInt(timestamp, 10)));
const formatJSON = (json) => {
  if (json) {
    try {
      // fixed nested json
      const fixed = json
        .replace(/"([Ww]\/)?"(\S+?)""/g, '"$1\\"$2\\""')
        .replace(/"({\S+?})"/g, ($0, json) => json);
      return Prism.highlight(JSON.stringify(JSON.parse(fixed), undefined, 2), Prism.languages.javascript, 'javascript');
    } catch (err) {
      console.error(json, err);
      return json;
    }
  }
  return '';
};

let logs = [];
let query = {};
let offset = 0;
let autoLoadTimer;

let windowHeight;
let contentHeight;
let scrollTop;

function load(q) {
  const oneHourAgo = Date.now() - 3600000;
  if (q) {
    if (q.level) {
      q.level = levels[q.level];
    }
    if (q.timestampStart && parseInt(q.timestampStart, 10) >= oneHourAgo) {
      clearInterval(autoLoadTimer);
      autoLoadTimer = setInterval(load, 10000);
    }
    query = q;
    offset = 0;
    logs = [];
  }
  if (!query.timestampStart || parseInt(query.timestampStart, 10) < oneHourAgo) {
    clearInterval(autoLoadTimer);
  }
  queryLogs(assign({
    offset,
  }, query)).then((data) => {
    if (data && data.rows) {
      logs = logs.concat(data.data.map(log => assign({
        collapse: true,
      }, log)));
      offset += data.rows;
    }
  });
}

function onHashChange(path) {
  const p = path.newURL || path;
  const hash = p.indexOf('#');
  load(hash > 0 ? querystring(p.substr(hash + 1)) : {});
}

const onScroll = debounce(300, () => {
  const total = body.scrollHeight || documentElement.scrollHeight;
  const valid = total - windowHeight;
  scrollTop = window.pageYOffset || documentElement.scrollTop || body.scrollTop;
  if (valid - scrollTop < windowHeight * 1.3) { // load if scroll over 70% of page
    load();
  }
});

onHashChange(window.location.href);
</script>

<svelte:window bind:innerHeight={windowHeight} on:scroll={onScroll} on:hashchange={onHashChange}></svelte:window>

<div bind:clientHeight={contentHeight}>
  {#each logs as log}
    <div class="log {log[5] ? 'log-collapse' : ''}" on:click={() => log.collapse = !log.collapse}>
      <div class="log-line">
        <div class="log-arrow"><Fa icon={faAngleDown} rotate={log.collapse ? -90 : 0}></Fa></div>
        <div class="log-icon log-{log[1]}"><Fa icon={levelIcons[`${log[1]}`]}></Fa></div>
        <div class="log-message">
          <span class="log-time">[{formatTimestamp(log[0])}]</span>
          <span class="log-pre log-{log[1]}">{formatLevel(log[1])}</span>
          <span class="log-hostname">[{log[2]}]</span>
          <span class="log-module">[{log[3]}]</span>
          <span class="log-pre">{log[4]}</span>
        </div>
      </div>
      {#if !log.collapse && log[5]}
        <div><pre class="language-js"><code>{@html formatJSON(log[5])}</code></pre></div>
      {/if}
    </div>
  {/each}
</div>

<div style="height: {windowHeight > contentHeight ? windowHeight - contentHeight + 50 : 0}px"></div>

<style lang="stylus">
@media(min-width: 768px)
  :global(::-webkit-scrollbar)
    width: 8px
    height: @width
    background-color: rgba(#000, .1)

  :global(::-webkit-scrollbar-thumb)
    background-color: rgba(#fff, .4)
    border-radius: 8px

:global(body)
:global(#app)
  background: #272822
  color: #fff
  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace
  font-size: 14px

.log
  &-line
    &:after
      display: block
      content: ""
      clear: both
  &-arrow
    float: left
    width: 1em
    margin: -.1em 0
    opacity: 0
  &-icon
    float: left
    width: 1em
    margin: .1em
  &-message
    margin-left: 2.5em
  &-time
    color: #358cd6
  &-hostname
  &-module
    color: #999
  &-pre
    white-space: pre-wrap
  &-10
    color: #777
  &-20
    color: #16bc79
  &-30
    color: #9cdcda
  &-40
    color: #dcdcaa
  &-50
    color: #ef5350
  &-60
    color: #e83334
  &-collapse
    cursor: pointer
    .log-arrow
      opacity: 1
</style>
