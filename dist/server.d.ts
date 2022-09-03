declare function isSassJsFile(filename: any): any;
declare function viteSassToCss(): {
    name: string;
    transform(src: any, id: any): {
        code: any;
        map: null;
    } | undefined;
};
declare function transformSassLiteral(js: any): any;
declare function replaceSassLiteralWithCssLiteral(js: any): any;

declare function startServer(options: Record<string, any>): Promise<void>;

export { isSassJsFile, replaceSassLiteralWithCssLiteral, startServer, transformSassLiteral, viteSassToCss };
