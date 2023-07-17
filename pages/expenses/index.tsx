import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import React, { useEffect, useState } from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  DateField,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslate } from "@refinedev/core";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { ExpenseTypes } from "src/interfaces/common";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import LinearDeterminate from "@components/progress/linear";
import { getAmountFormatted, getProgress } from "src/utility/helper";

const ExpenseList: React.FC<any> = (props) => {
  const translate = useTranslate();
  const { dataGridProps } = useDataGrid({
    filters: {
      permanent: [
        {
          field: "email",
          operator: "eq",
          value: props.email,
        },
      ],
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
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
    [translate]
  );

  const [rows, setRows] = useState<any>(null);

  useEffect(() => setRows(dataGridProps.rows), [dataGridProps]);

  return (
    <List>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manager
      </Typography>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Summary
      </Typography>
      {rows && rows.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h3">
                <ArrowDropUpIcon fontSize="large" color="success" />{" "}
                  {getAmountFormatted(rows, ExpenseTypes.Earning)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography variant="h3">
                <ArrowDropDownIcon fontSize="large" color="error" />{" "}
                  {getAmountFormatted(rows, ExpenseTypes.Expense)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearDeterminate
                progress={rows && getProgress(rows, ExpenseTypes.Earning)}
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <div style={{ width: "100%" }}>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation="pulse" />
        </div>
      )}
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

  const identity: any =
    authProvider.getIdentity && (await authProvider.getIdentity(context));

  return {
    props: {
      ...translateProps,
      email: identity.email,
    },
  };
};

export default ExpenseList;
