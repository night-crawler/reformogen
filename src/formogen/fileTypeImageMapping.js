import mt_msword from './images/mimetypes/application-msword.png';
import mt_pdf from './images/mimetypes/application-pdf.png';
import mt_excel from './images/mimetypes/application-vnd.ms-excel.png';
import mt_powerpoint from './images/mimetypes/application-vnd.ms-powerpoint.png';
import mt_7zip from './images/mimetypes/application-x-7zip.png';
import mt_rar from './images/mimetypes/application-x-rar.png';
import mt_tar from './images/mimetypes/application-x-tar.png';
import mt_zip from './images/mimetypes/application-x-zip.png';
import mt_wav from './images/mimetypes/audio-x-wav.png';
import mt_bpm from './images/mimetypes/image-bmp.png';
import mt_gif from './images/mimetypes/image-gif.png';
import nt_jpeg from './images/mimetypes/image-jpeg.png';
import mt_png from './images/mimetypes/image-png.png';
import mt_tiff from './images/mimetypes/image-tiff.png';
import mt_ico from './images/mimetypes/image-x-ico.png';
import mt_text_plain from './images/mimetypes/text-plain.png';
import mt_unknown from './images/mimetypes/unknown.png';

export const fileTypeImageMapping = {
  'docx': mt_msword,
  'xlsx': mt_excel,
  'pptx': mt_powerpoint,
  'pdf': mt_pdf,
  '7zip': mt_7zip,
  'rar': mt_rar,
  'tar': mt_tar,
  'zip': mt_zip,
  'wav': mt_wav,
  'mp3': mt_wav,
  'bpm': mt_bpm,
  'gif': mt_gif,
  'jpeg': nt_jpeg,
  'jpg': nt_jpeg,
  'png': mt_png,
  'tiff': mt_tiff,
  'ico': mt_ico,
  'txt': mt_text_plain,
};

export const UNKNOWN_FILE_TYPE = mt_unknown;
