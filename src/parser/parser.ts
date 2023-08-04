import { homedir } from 'os';

import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import highlight from './highlight';

const mdit = new MarkdownIt({
    html: true,
    highlight: (str, lang) => {
        console.log(lang, str);
        const h = highlight(str, lang);
        console.log(h);
        return h;
    },
});

mdit.use(anchor, {
    permalink: anchor.permalink.ariaHidden({
        placement: 'before',
    }),
});
/* eslint-disable @typescript-eslint/no-var-requires */
mdit.use(require('markdown-it-emoji'));
mdit.use(require('markdown-it-task-lists'));
mdit.use(require('markdown-it-inject-linenumbers'));
mdit.use(require('markdown-it-katex'));
/* eslint-enable @typescript-eslint/no-var-requires */

export const pathHeading = (path: string) => `# \`${path.replace(homedir(), '~')}\``;

export default function parse(src: string, path?: string) {
    let md = src;

    const fileEnding = path?.split('.')?.at(-1);
    if (fileEnding && fileEnding !== 'md') {
        md = `${pathHeading(path!)}\n\n\`\`\`${fileEnding}\n${src}\n\`\`\``;
    }

    return mdit.render(md);
}
