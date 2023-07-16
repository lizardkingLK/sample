import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import {
  useShow,
  IResourceComponentsProps,
  useTranslate,
} from "@refinedev/core";
import {
  Show,
  NumberField,
  DateField,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import {  Stack, Box, Grid } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ExpenseTypes } from "src/interfaces/common";

const ExpenseShow: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Stack gap={1}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField value={record?.description} variant="h5" />
            {record?.created_at && (
              <Box
                sx={{ display: "flex", flexDirection: "column" }}
                title={translate("expenses.fields.created_at")}
              >
                <DateField
                  format="LLL"
                  variant="body1"
                  value={record?.created_at}
                  color={"lightgray"}
                  fontStyle={"italic"}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            {record?.amount && (
              <Box
                sx={{ display: "flex" }}
                title={translate("expenses.fields.amount")}
              >
                {record?.type === ExpenseTypes.Earning ? (
                  <ArrowDropUpIcon fontSize="large" color="success" />
                ) : (
                  <ArrowDropDownIcon fontSize="large" color="error" />
                )}
                <NumberField variant="h3" value={record.amount} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Stack>
    </Show>
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

export default ExpenseShow;
