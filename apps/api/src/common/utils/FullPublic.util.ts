import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Public } from "src/decorators/public.decorator";

/**
 * Decorador que **ANULA** cualquier **SEGURIDAD** y la fija en **PUBLICA**
 */
export function FullPublic() {
    return applyDecorators(
        Public(),
        ApiOperation({ security: [] })
    )
}