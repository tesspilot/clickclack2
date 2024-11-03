declare module '@zip.js/zip.js' {
    export interface ZipEntry {
        filename: string;
        directory: boolean;
        getData?: (writer: BlobWriter, options: any) => Promise<Blob>;
    }

    export class ZipReader {
        constructor(reader: BlobReader);
        getEntries(): Promise<ZipEntry[]>;
    }

    export class BlobReader {
        constructor(blob: Blob);
    }

    export class BlobWriter {
        constructor(mimeType: string);
    }
}
