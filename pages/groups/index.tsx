import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { DataGrid } from "@mui/x-data-grid";
import { useDataGrid } from "@refinedev/mui";

export interface IGroup {
  id: string;
  created_at: string;
  name: string;
}

const PostList: React.FC = () => {
  const { dataGridProps } = useDataGrid<IGroup>({
    sorters: {
      initial: [
        {
          field: "id",
          order: "asc",
        },
      ],
    },
    meta: {
      select: "id, created_at, name",
    },
  });

  return (
    <DataGrid
      columns={[{ field: "id", headerName: "#" }, { field: "name", headerName: "Name", width: 300 }]}
      {...dataGridProps}
    />
  );
};

export default PostList;


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
        destination: `${redirectTo}?to=${encodeURIComponent("/blogs")}`,
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