import { v4 as uuidv4 } from 'uuid';

/**
 * Car model stored in memory.  All boolean flags use 'Y' or 'N' values
 * according to the competition specification.  A UUID (without dashes) is
 * generated on construction.
 */
export class Car {
  carId: string;
  carNm: string;
  carNo: string;
  carImgUrl?: string;
  strtgYn: 'Y' | 'N' = 'N';
  doorYn: 'Y' | 'N' = 'N';
  wndwYn: 'Y' | 'N' = 'N';
  emgncLmpYn: 'Y' | 'N' = 'N';
  drvngPosblDstnc: number = 0;
  tailgateYn: 'Y' | 'N' = 'N';
  hoodYn: 'Y' | 'N' = 'N';
  cdysmYn: 'Y' | 'N' = 'N';
  handleYn: 'Y' | 'N' = 'N';
  frontmirrorYn: 'Y' | 'N' = 'N';
  backmirrorHeatYn: 'Y' | 'N' = 'N';
  sidemirrorHeatYn: 'Y' | 'N' = 'N';

  constructor(partial: Partial<Car>) {
    Object.assign(this, partial);
    this.carId = uuidv4().replace(/-/g, '').toUpperCase();
  }
}