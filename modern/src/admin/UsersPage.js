import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  makeStyles,
  IconButton,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useEffectAsync } from "../reactHelper";
import EditCollectionView from "../EditCollectionView";
import { formatBoolean } from "../common/formatter";
import OptionsLayout from "../settings/OptionsLayout";
import { useTranslation } from "../LocalizationProvider";

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const UsersView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();
  const t = useTranslation();

  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch("/api/users");
    if (response.ok) {
      setItems(await response.json());
    }
  }, [updateTimestamp]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.columnAction} />
            <TableCell>{t("sharedName")}</TableCell>
            <TableCell>{t("userEmail")}</TableCell>
            <TableCell>{t("userAdmin")}</TableCell>
            <TableCell>{t("sharedDisabled")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={classes.columnAction} padding="none">
                <IconButton
                  onClick={(event) => onMenuClick(event.currentTarget, item.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{formatBoolean(item, "administrator", t)}</TableCell>
              <TableCell>{formatBoolean(item, "disabled", t)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const UsersPage = () => (
  <OptionsLayout>
    <EditCollectionView content={UsersView} editPath="/user" endpoint="users" />
  </OptionsLayout>
);

export default UsersPage;
