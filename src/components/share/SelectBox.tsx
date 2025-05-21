import { SelectHTMLAttributes } from "react";

type Option = {
    label: string;
    value: string;
};

interface SelectBoxProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: Option[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SelectBox({
    label,
    options,
    value,
    onChange,
    ...props
}: SelectBoxProps) {
    return (
        <label className="flex items-center gap-2">
            <span className="font-medium">{label}:</span>
            <select
                value={value}
                onChange={onChange}
                className="border border-gray-300 rounded px-2 py-1"
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
