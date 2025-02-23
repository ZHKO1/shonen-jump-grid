import { defaultDocument } from "@/lib";
import { useCallback, useRef, useState } from "react";

export type UseFileDialog = (options?: UseFileDialogOptions) => readonly [
  FileList | null,
  (localOptions?: Partial<UseFileDialogOptions>) => Promise<FileList | null | undefined>,
  () => void,
]

export interface UseFileDialogOptions {
  accept?: string,
  multiple?: boolean,
  capture?: string,
}

const DEFAULT_OPTIONS: UseFileDialogOptions = {
  multiple: true,
  accept: "*",
}

export const useFileDialog: UseFileDialog = (
  options: UseFileDialogOptions = {}
) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileOpenPromiseRef = useRef<Promise<FileList | null> | null>(null);
  const resolveFileOpenPromiseRef = useRef<(value: FileList | null) => void>(() => { });
  const initFn = useCallback(() => {
    if (!defaultDocument) {
      return null;
    }

    const input = defaultDocument.createElement('input');
    input.type = 'file'

    input.onchange = (event: Event) => {
      const result = event.target as HTMLInputElement;
      setFiles(result.files);
      resolveFileOpenPromiseRef.current?.(result.files);
    }
    return input;
  }, []);

  inputRef.current = initFn()

  const open = async (localOptions?: Partial<UseFileDialogOptions>) => {
    if (!inputRef.current) {
      return;
    }
    const _options = {
      ...DEFAULT_OPTIONS,
      ...options,
      ...localOptions,
    }

    inputRef.current.multiple = _options.multiple!
    inputRef.current.accept = _options.accept!
    inputRef.current.capture = _options.capture!

    fileOpenPromiseRef.current = new Promise((resolve) => {
      resolveFileOpenPromiseRef.current = resolve;
    });

    inputRef.current.click();
    return fileOpenPromiseRef.current;
  }

  const reset = () => {
    setFiles(null);
    resolveFileOpenPromiseRef.current?.(null)
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return [files, open, reset] as const
}