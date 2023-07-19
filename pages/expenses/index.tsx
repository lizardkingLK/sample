import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
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
import {
  Box,
  Button,
  Grid,
  Skeleton,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import LinearDeterminate from "@components/progress/linear";
import {
  getAmountFormatted,
  getCurrentDate,
  getProgress,
} from "src/utility/helper";

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
        filterable: false,
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
        filterable: false,
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
        filterable: false,
      },
    ],
    [translate]
  );

  const [rows, setRows] = useState<any>(null);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [filtered, setFiltered] = useState<any>(null);

  useEffect(() => setRows(dataGridProps.rows), [dataGridProps]);
  useEffect(() => setFiltered(dataGridProps.rows), [rows]);

  const handleChange = (e: { target: { value: any; name: string } }) => {
    let value = e.target.value;
    if (e.target.name === "start") {
      setStart(new Date(value));
    } else if (e.target.name === "end") {
      setEnd(new Date(value));
    }
  };

  const handleFilter = () => {
    if (rows && rows.length > 0 && start && end) {
      const fd = rows.filter(
        (r: { created_at: string | number | Date }) =>
          new Date(r.created_at) >= start && new Date(r.created_at) <= end
      );
      console.log(fd);
      setFiltered(fd);
    }
  };

  const handleClear = () => {
    setFiltered(rows);
  };

  return (
    <List>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manager
      </Typography>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Summary
      </Typography>
      {filtered && filtered.length > 0 ? (
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h3">
                <ArrowDropUpIcon fontSize="large" color="success" />{" "}
                {getAmountFormatted(filtered, ExpenseTypes.Earning)}
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Typography variant="h3">
                <ArrowDropDownIcon fontSize="large" color="error" />{" "}
                {getAmountFormatted(filtered, ExpenseTypes.Expense)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearDeterminate
                progress={
                  filtered && getProgress(filtered, ExpenseTypes.Earning)
                }
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
      <Grid container spacing={2}>
        <Grid item xs={12} my={4}>
          <Typography variant="button">Filter</Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            placeholder={`Enter Start Date. i.e: ${getCurrentDate()}`}
            fullWidth
            name="start"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            size="small"
            placeholder={`Enter End Date. i.e: ${getCurrentDate()}`}
            fullWidth
            name="end"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Button color="success" onClick={handleFilter}>
            GO
          </Button>
          <Button color="warning" onClick={handleClear}>
            Clear
          </Button>
        </Grid>
      </Grid>
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
