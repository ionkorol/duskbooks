import React, { useEffect, useState } from "react";
import { AdminLayout } from "components/admin";

import styles from "./Users.module.scss";
import { Table } from "react-bootstrap";
import { GetServerSideProps } from "next";
import { isAuth } from "utils/functions";
import { FirebaseUserProp } from "utils/interfaces";
import { server } from "config";

interface Props {
  usersData: FirebaseUserProp[];
  error: any;
}

const AdminUsers: React.FC<Props> = (props) => {
  const { usersData, error } = props;
  console.log(error);

  const [currentUsers, setCurrentUsers] = useState(usersData);
  console.log(currentUsers);


  return (
    <AdminLayout>
      <div className={styles.container}>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {usersData.map((user) => (
              <tr key={user.email}>
                <td>
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const jsonData = await (await fetch(`${server}/api/users`)).json();
    if (jsonData.status) {
      const usersData = jsonData.data;

      return {
        props: {
          usersData,
        },
      };
    } else {
      return {
        props: {
          usersData: [],
          error: jsonData,
        },
      };
    }
  } catch (error) {
    return {
      props: {
        usersData: [],
        error: JSON.stringify(error),
      },
    };
  }
};
