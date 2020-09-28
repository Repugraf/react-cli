import fs, { mkdirSync as mkdir, copyFileSync as copy } from "fs";
import path from "path";

export const copyDir = (src: string, dest: string) => {
  mkdir(dest);
  const files = fs.readdirSync(src);
  for (let i = 0; i < files.length; i++) {
    const current = fs.lstatSync(path.join(src, files[i]));
    if (current.isDirectory()) {
      copyDir(path.join(src, files[i]), path.join(dest, files[i]));
    } else if (current.isSymbolicLink()) {
      const symlink = fs.readlinkSync(path.join(src, files[i]));
      fs.symlinkSync(symlink, path.join(dest, files[i]));
    } else {
      copy(path.join(src, files[i]), path.join(dest, files[i]));
    }
  }
};
