import { ValueTransformer } from "typeorm";


export const transformerJson: ValueTransformer = {
    to: (value: Record<string, any>|null) => ( value ? JSON.stringify( value ) : null ),
    from: (value: string|null) => {
        if ( !value ) return null;
        try {
            return typeof value === "string" ? JSON.parse(value) : value;
        } catch {
            return null
        }
    }
}