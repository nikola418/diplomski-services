import * as set from '@nestjs/common/decorators/core/set-metadata.decorator';
import { IS_PUBLIC, Public } from './is-public.decorator';
import { createMock } from '@golevelup/ts-jest';

describe('Public', () => {
  it('should call SetMetadata with IS_PUBLIC to true', () => {
    const spy = jest
      .spyOn(set, 'SetMetadata')
      .mockReturnValue(
        createMock<set.CustomDecorator<string>>({ KEY: IS_PUBLIC }),
      );

    Public();
    expect(spy).toHaveBeenCalledWith(IS_PUBLIC, true);
  });
});
