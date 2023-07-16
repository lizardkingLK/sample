import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { Edit } from "@refinedev/mui";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslate } from "@refinedev/core";
import { useEffect, useState } from "react";
import { ExpenseTypes } from "src/interfaces/common";

export const ExpenseEdit: React.FC<any> = (props) => {
  const translate = useTranslate();
  const {
    saveButtonProps,
    refineCore: { queryResult },
    register,
    control,
    formState: { errors },
  } = useForm();
  const expensesData = queryResult?.data?.data;

  const [type, setType] = useState<string>(ExpenseTypes.Earning);

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  useEffect(() => {
    if (expensesData) {
        setType(expensesData.type);
    }
  }, []);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <FormControl sx={{ display: "none" }}>
          <TextField
          {...register("id", {
            required: "This field is required",
            valueAsNumber: true,
          })}
          error={!!(errors as any)?.id}
          helperText={(errors as any)?.id?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label={translate("expenses.fields.id")}
          name="id"
          disabled
          />
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
          name="description"
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
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
            <MenuItem value={ExpenseTypes.Earning}>
              {ExpenseTypes.Earning}
            </MenuItem>
            <MenuItem value={ExpenseTypes.Expense}>
              {ExpenseTypes.Expense}
            </MenuItem>
          </Select>
        </FormControl>
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
          />
        </FormControl>
        <FormControl sx={{ display: "none" }}>
          <TextField {...register("email")} value={props.email} />
        </FormControl>
      </Box>
    </Edit>
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

  const identity: any =
    authProvider.getIdentity && (await authProvider.getIdentity(context));

  return {
    props: {
      ...translateProps,
      email: identity.email,
    },
  };
};

export default ExpenseEdit;
