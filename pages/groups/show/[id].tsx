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
import { GetServerSideProps } from "next";
import { authProvider } from "src/authProvider";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const GroupShow: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { queryResult } = useShow();
    const { data, isLoading } = queryResult;

    const record = data?.data;

    return (
        <Show isLoading={isLoading}>
            <Stack gap={1}>
                <Typography variant="body1" fontWeight="bold">
                    {translate("groups.fields.id")}
                </Typography>
                <NumberField value={record?.id ?? ""} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("groups.fields.created_at")}
                </Typography>
                <DateField value={record?.created_at} />
                <Typography variant="body1" fontWeight="bold">
                    {translate("groups.fields.name")}
                </Typography>
                <TextField value={record?.name} />
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
                destination: `${redirectTo}?to=${encodeURIComponent("/groups")}`,
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

export default GroupShow;