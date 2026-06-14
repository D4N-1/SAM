import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiSecurity } from "@nestjs/swagger";
import { Public } from "src/decorators/public.decorator";
import { Roles } from "src/decorators/roles-user.decorator";


export function ApiPublic() {
    return applyDecorators(
        Public(),
        ApiOperation({ security: [] })
    )
}