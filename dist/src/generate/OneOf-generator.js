"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OneOfNGenerator = void 0;
const SuppressNGenerator = (suppressCount) => {
    const suppressTypeArgs = [];
    for (let i = 0; i < suppressCount; i++) {
        suppressTypeArgs.push(`S${i}`);
    }
    const suppressType = `Suppress_${suppressCount}<T, ${suppressTypeArgs.join(', ')}>`;
    const excludeType = `Exclude<(keyof ${suppressTypeArgs.join(' | keyof ')}), keyof T>`;
    return `type ${suppressType} = T & { [P in ${excludeType}]?: never };`;
};
const OneOfNGenerator = (typeCount) => {
    if (!Number.isInteger(typeCount) || typeCount < 2) {
        return undefined;
    }
    const typeArgs = [];
    for (let i = 0; i < typeCount; i++) {
        typeArgs.push(`T${i}`);
    }
    const pipeSepTypes = typeArgs.join(' | ');
    const firstLine = `type OneOf_${typeCount}<${typeArgs.join(', ')}> = (${pipeSepTypes}) extends object`;
    const middleLines = [];
    const suppressCount = typeCount - 1;
    for (let i = 0; i < typeCount; i++) {
        const temp = typeArgs[i];
        typeArgs[i] = typeArgs[0];
        typeArgs[0] = temp;
        middleLines.push(`Suppress_${suppressCount}<${typeArgs.join(', ')}>`);
    }
    const middle = `? ${middleLines.join('\n| ')}`;
    const lastLine = `: ${pipeSepTypes};`;
    const suppressType = SuppressNGenerator(suppressCount);
    return [firstLine, middle, lastLine, suppressType].join('\n');
};
exports.OneOfNGenerator = OneOfNGenerator;
