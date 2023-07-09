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
import { Typography, Stack } from "@mui/material";

const ExpenseShow: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    {translate("expenses.fields.id")}
                </Typography>
                <NumberField value={record?.id ?? ""} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("expenses.fields.created_at")}
                </Typography>
                <DateField value={record?.created_at} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("expenses.fields.description")}
                </Typography>
                <TextField value={record?.description} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("expenses.fields.type")}
                </Typography>
                <TextField value={record?.type} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("expenses.fields.amount")}
                </Typography>
                <NumberField value={record?.amount ?? ""} />
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
