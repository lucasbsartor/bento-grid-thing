import type { GridCell } from '$lib/stores/grid.svelte';

export interface GenerateCodeOptions {
	cols: number;
	gap: number;
	cells: GridCell[];
	includeComments?: boolean;
	includePlaceholder?: boolean;
}

const gapClasses: Record<number, string> = {
	0: 'gap-0',
	1: 'gap-1',
	2: 'gap-2',
	3: 'gap-3',
	4: 'gap-4',
	5: 'gap-5',
	6: 'gap-6',
	7: 'gap-7',
	8: 'gap-8'
};

const colClasses: Record<number, string> = {
	2: 'grid-cols-2',
	3: 'grid-cols-3',
	4: 'grid-cols-4',
	5: 'grid-cols-5',
	6: 'grid-cols-6'
};

const colspanClasses: Record<number, string> = {
	1: 'col-span-1',
	2: 'col-span-2',
	3: 'col-span-3',
	4: 'col-span-4',
	5: 'col-span-5',
	6: 'col-span-6'
};

const rowspanClasses: Record<number, string> = {
	1: 'row-span-1',
	2: 'row-span-2',
	3: 'row-span-3',
	4: 'row-span-4'
};

export function generateCode(options: GenerateCodeOptions): string {
	const { cols, gap, cells, includeComments = false, includePlaceholder = true } = options;

	const gridClass = `grid ${colClasses[cols]} ${gapClasses[gap]}`;

	let code = '';

	if (includeComments) {
		code += `<!-- Bento Grid: ${cols} columns, gap-${gap} -->\n`;
	}

	code += `<div class="${gridClass}">\n`;

	cells.forEach((cell, index) => {
		const cellClasses: string[] = [];

		// Add col-span class (skip if 1 for cleaner output)
		if (cell.colspan > 1) {
			cellClasses.push(colspanClasses[cell.colspan]);
		}

		// Add row-span class (skip if 1 for cleaner output)
		if (cell.rowspan > 1) {
			cellClasses.push(rowspanClasses[cell.rowspan]);
		}

		// Add styling classes
		cellClasses.push('bg-neutral-800', 'rounded-lg', 'p-4');

		const classString = cellClasses.join(' ');
		const content = includePlaceholder ? `Item ${index + 1}` : '';

		if (includeComments && (cell.colspan > 1 || cell.rowspan > 1)) {
			code += `  <!-- ${cell.colspan}x${cell.rowspan} -->\n`;
		}

		code += `  <div class="${classString}">${content}</div>\n`;
	});

	code += '</div>';

	return code;
}

// Generate code with syntax highlighting tokens
export interface CodeToken {
	type: 'tag' | 'attr' | 'string' | 'text' | 'comment' | 'punctuation';
	value: string;
}

export function tokenizeCode(code: string): CodeToken[] {
	const tokens: CodeToken[] = [];
	let remaining = code;

	while (remaining.length > 0) {
		// Match HTML comments
		const commentMatch = remaining.match(/^(<!--[\s\S]*?-->)/);
		if (commentMatch) {
			tokens.push({ type: 'comment', value: commentMatch[1] });
			remaining = remaining.slice(commentMatch[1].length);
			continue;
		}

		// Match opening tags with attributes
		const openTagMatch = remaining.match(/^(<)(\w+)/);
		if (openTagMatch) {
			tokens.push({ type: 'punctuation', value: '<' });
			tokens.push({ type: 'tag', value: openTagMatch[2] });
			remaining = remaining.slice(openTagMatch[0].length);

			// Match attributes
			while (true) {
				// Match whitespace
				const wsMatch = remaining.match(/^(\s+)/);
				if (wsMatch) {
					tokens.push({ type: 'text', value: wsMatch[1] });
					remaining = remaining.slice(wsMatch[1].length);
				}

				// Match attribute
				const attrMatch = remaining.match(/^(\w+)(=)("([^"]*)")/);
				if (attrMatch) {
					tokens.push({ type: 'attr', value: attrMatch[1] });
					tokens.push({ type: 'punctuation', value: '=' });
					tokens.push({ type: 'string', value: attrMatch[3] });
					remaining = remaining.slice(attrMatch[0].length);
					continue;
				}

				// Match closing >
				const closeMatch = remaining.match(/^(>)/);
				if (closeMatch) {
					tokens.push({ type: 'punctuation', value: '>' });
					remaining = remaining.slice(1);
					break;
				}

				break;
			}
			continue;
		}

		// Match closing tags
		const closeTagMatch = remaining.match(/^(<\/)(\w+)(>)/);
		if (closeTagMatch) {
			tokens.push({ type: 'punctuation', value: '</' });
			tokens.push({ type: 'tag', value: closeTagMatch[2] });
			tokens.push({ type: 'punctuation', value: '>' });
			remaining = remaining.slice(closeTagMatch[0].length);
			continue;
		}

		// Match text content (anything until next < or end)
		const textMatch = remaining.match(/^([^<]+)/);
		if (textMatch) {
			tokens.push({ type: 'text', value: textMatch[1] });
			remaining = remaining.slice(textMatch[1].length);
			continue;
		}

		// Safety: move forward one character if nothing matches
		tokens.push({ type: 'text', value: remaining[0] });
		remaining = remaining.slice(1);
	}

	return tokens;
}
