import { ValueTransformer } from "typeorm";


export const transformerJson: ValueTransformer = {
    to: (value: Record<string, any>) => ( value ? JSON.stringify( value ) : null ),
    from: (value: string) => {
        if ( !value ) return null;
        try {
            return typeof value === "object" ? JSON.parse(value) : value;
        } catch {
            return null
        }
    }
}