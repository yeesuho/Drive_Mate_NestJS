/**
 * DTO for updating multiple properties of a car at once.  All fields are
 * optional; missing values will be ignored.  Field names mirror the
 * competition API exactly.
 */
export class UpdateCarAllDto {
  strtgYn?: 'Y' | 'N';
  doorYn?: 'Y' | 'N';
  wndwYn?: 'Y' | 'N';
  emgncLmpYn?: 'Y' | 'N';
  drvngPosblDstnc?: number;
  tailgateYn?: 'Y' | 'N';
  hoodYn?: 'Y' | 'N';
  cdysmYn?: 'Y' | 'N';
  handleYn?: 'Y' | 'N';
  frontmirrorYn?: 'Y' | 'N';
  backmirrorHeatYn?: 'Y' | 'N';
  sidemirrorHeatYn?: 'Y' | 'N';
}