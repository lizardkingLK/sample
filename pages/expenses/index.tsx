import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  DateField,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ExpenseTypes } from "src/interfaces/common";
import { Box } from "@mui/material";

const ExpenseList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { dataGridProps } = useDataGrid();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: translate("expenses.fields.id"),
        type: "number",
        minWidth: 50,
      },
      {
        field: "description",
        flex: 1,
        headerName: translate("expenses.fields.description"),
        minWidth: 400,
      },
      {
        field: "type",
        flex: 1,
        headerName: translate("expenses.fields.type"),
        minWidth: 200,
      },
      {
        field: " ",
        flex: 1,
        minWidth: 200,
        renderCell: function render({ row }) {
          return (
            <Box display={"flex"} alignItems={"center"}>
              {row.type === ExpenseTypes.Earning ? (
                <ArrowDropUpIcon fontSize="large" color="success" />
              ) : (
                <ArrowDropDownIcon fontSize="large" color="error" />
              )}
            </Box>
          );
        },
        filterable: false,
        sortable: false,
        hideable: false,
      },
      {
        field: "created_at",
        flex: 1,
        headerName: translate("expenses.fields.created_at"),
        minWidth: 250,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
      },
      {
        field: "amount",
        flex: 1,
        headerName: translate("expenses.fields.amount"),
        type: "number",
        minWidth: 200,
      },
      {
        field: "actions",
        headerName: translate("table.actions"),
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
              <ShowButton hideText recordItemId={row.id} />
              <DeleteButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    [translate],
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
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

export default ExpenseList;
