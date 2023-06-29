// import { ChangeEvent } from "react";
// import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
// import { FormControl, FormLabel, MenuItem, RadioGroup, SxProps, TextField, Theme } from "@mui/material";
// import "./InputRadioComponent.css";
// // import { Box, TextField } from "@mui/material";
// // import { Controller } from "react-hook-form";

// interface Props<T> extends UseControllerProps<T> {
//     sx?: SxProps<Theme>;
//     label: string;
//     disabled?: boolean;
//     radioOptions: {value: string, label: string}[];
//     hidden?: boolean;
//     onChange?: React.ChangeEventHandler;
// }

// const InputRadioComponent = <T extends FieldValues>({
//     sx,
//     name,
//     label,
//     disabled,
//     defaultValue,
//     radioOptions,
//     control,
//     rules,
//     onChange,
// }: Props<T>) => {
//     const inputLabel = label != null ? label : name;

//     const onChangeWrapper = (
//         onChangeWrapped: (...event: any[]) => void,
//         value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         if (onChange != null) {
//             onChange(value);
//         }
//         onChangeWrapped(value);
//     };

//     return (
//         <>
//             {control ? (
//                 <FormControl>
//                 <FormLabel id="demo-radio-buttons-group-label">
//                     {label}
//                 </FormLabel>
//                 <Controller
//                     control={control}
//                     name={name}
//                     render={({ field: { onChange, value } }) => (
//                         <RadioGroup
//                             aria-labelledby="demo-radio-buttons-group-label"
//                             defaultValue="none"
//                             name="radio-buttons-group"
//                             value={value || "none"}
//                             onChange={onChange}
//                         >
//                             {radioOptions.map(()=>{
//                                 <FormControlLabel
//                                     value={value}
//                                     control={<Radio />}
//                                     label={label}
//                                 />
//                             })}
//                         </RadioGroup>
//                     )}
//                 />
//             </FormControl>
//             ) : (
//                 <TextField
//                     sx={{ flex: 1, minWidth: "10em", maxWidth: "20em" }}
//                     disabled={disabled || false}
//                     InputLabelProps={{
//                         shrink: type === "file" ? true : undefined,
//                     }}
//                     inputProps={
//                         type === "number"
//                             ? { inputMode: "numeric", pattern: "[0-9]*" }
//                             : {}
//                     }
//                     select={type === "select"}
//                     label={inputLabel}
//                     margin="dense"
//                     type={type === "number" ? "text" : type}
//                     color="secondary"
//                     variant="filled"
//                     placeholder={inputLabel}
//                     defaultValue={defaultValue}
//                     onChange={(value) => {
//                         onChange && onChange(value);
//                     }}
//                 >
//                     {type === "select" && selectOptions ? (
//                         selectOptions?.map((value) => (
//                             <MenuItem key={value[0]} value={value[0]}>
//                                 {value[1]}
//                             </MenuItem>
//                         ))
//                     ) : (
//                         <MenuItem>{defaultValue}</MenuItem>
//                     )}
//                 </TextField>
//             )}
//         </>
//     );
// };

// export default InputRadioComponent;
