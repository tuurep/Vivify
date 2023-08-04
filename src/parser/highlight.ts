import { instance } from '@viz-js/viz';
import hljs from 'highlight.js';
import { registerAsyncInit } from '../app';

let viz: Awaited<ReturnType<typeof instance>> | undefined = undefined;
const init = async () => {
    viz = await instance();
};
registerAsyncInit(init);

function renderDot(str: string) {
    if (!viz) return '<p>Please reload the page to see graphs rendered.</p>';
    try {
        console.log('rendering');
        return viz.renderString(str, { format: 'svg' });
    } catch (e) {
        return `<p>Error while parsing dot: ${e}</p>`;
    }
}

const renderers = new Map<string, (str: string) => string>([
    ['dot', renderDot],
    ['graphviz', renderDot],
]);

export default function highlight(str: string, lang: string) {
    let content = str;
    if (lang) {
        if (renderers.has(lang)) return renderers.get(lang)!(str);
        if (hljs.getLanguage(lang)) {
            try {
                content = hljs.highlight(content, {
                    language: lang,
                    ignoreIllegals: true,
                }).value;
            } catch (_) {}
        }
    }
    return `<pre class="language-${lang}"><code>${content}</code></pre>`;
}
