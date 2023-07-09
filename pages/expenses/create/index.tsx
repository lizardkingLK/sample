import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { Create } from "@refinedev/mui";
import { Box, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { useState } from "react";
import { ExpenseTypes } from "src/interfaces/common";

export const ExpenseCreate: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const {
        saveButtonProps,
        refineCore: { formLoading },
        register,
        control,
        formState: { errors },
    } = useForm();
    const [type, setType] = useState<string>(ExpenseTypes.Earning);

    const handleChange = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    return (
        <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column" }}
                autoComplete="off"
            >
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="expense-type-input">Type</InputLabel>
                    <Select
                        {...register("type", {
                            required: "This field is required",
                        })}
                        labelId="expense-type-input"
                        id="expense-type-input-element"
                        value={type}
                        label="Type"
                        onChange={handleChange}
                    >
                        <MenuItem value={ExpenseTypes.Earning}>{ExpenseTypes.Earning}</MenuItem>
                        <MenuItem value={ExpenseTypes.Expense}>{ExpenseTypes.Expense}</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    {...register("description", {
                        required: "This field is required",
                    })}
                    error={!!(errors as any)?.description}
                    helperText={(errors as any)?.description?.message}
                    margin="normal"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    type="text"
                    label={translate("expenses.fields.description")}
                    placeholder="Enter some note..."
                    name="description"
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                        {...register("amount", {
                            required: "This field is required",
                            valueAsNumber: true,
                        })}
                        error={!!(errors as any)?.amount}
                        fullWidth
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label={translate("expenses.fields.amount")}
                        name="amount"
                        defaultValue={"0.00"}
                    />
                </FormControl>
            </Box>
        </Create>
    );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated, redirectTo } = await authProvider.check(context);

    const translateProps = await serverSideTranslations(context.locale ?? "en", [
        "common",
    ]);

    if (!authenticated) {
        return {
            props: {
                ...translateProps,
            },
            redirect: {
                destination: `${redirectTo}?to=${encodeURIComponent("/expenses")}`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            ...translateProps,
        },
    };
};

export default ExpenseCreate;
