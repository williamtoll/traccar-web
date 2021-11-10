import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Grid, Typography, Divider, Drawer, makeStyles, IconButton, Hidden,
} from '@material-ui/core';
import TimelineIcon from '@material-ui/icons/Timeline';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import SideNav from '../components/SideNav';
import NavBar from '../components/NavBar';
import { useTranslation } from '../LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  drawerContainer: {
    width: theme.dimensions.drawerWidthDesktop,
  },
  drawer: {
    width: theme.dimensions.drawerWidthDesktop,
    [theme.breakpoints.down('md')]: {
      width: theme.dimensions.drawerWidthTablet,
    },
  },
  content: {
    flex: 1,
    padding: theme.spacing(5, 3, 3, 3),
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  backArrowIconContainer: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  toolbar: {
    [theme.breakpoints.down('md')]: {
      ...theme.mixins.toolbar,
    },
  },
}));

const ReportLayout = ({ children, filter }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const t = useTranslation();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [reportTitle, setReportTitle] = useState();

  const routes = useMemo(() => [
    { name: 'Replay', href: '/replay', icon: <PlayCircleFilledIcon /> },
    { name: t('reportTrips'), href: '/reports/trip', icon: <PlayCircleFilledIcon /> },
    { name: t('reportEvents'), href: '/reports/event', icon: <NotificationsActiveIcon /> },
    { name: t('reportStops'), href: '/reports/stop', icon: <PauseCircleFilledIcon /> },
    { name: t('reportRoute'), href: '/reports/route', icon: <TimelineIcon /> },
    { name: t('reportSummary'), href: '/reports/summary', icon: <FormatListBulletedIcon /> },
    // { name: t('reportChart'), href: '/reports/chart', icon: <TrendingUpIcon /> },
  ], [t]);

  useEffect(() => {
    routes.forEach((route) => {
      switch (location.pathname) {
        case `${route.href}`:
          setReportTitle(route.name);
          break;
        default:
          break;
      }
    });
  }, [location]);

  const pageTitle = `${t('reportTitle')} / ${reportTitle}`;

  return (
    <div className={classes.root}>
      <Hidden only={['lg', 'xl']}>
        <NavBar setOpenDrawer={setOpenDrawer} title={pageTitle} />
        <Drawer
          variant="temporary"
          open={openDrawer}
          onClose={() => setOpenDrawer(!openDrawer)}
          classes={{ paper: classes.drawer }}
        >
          <SideNav routes={routes} />
        </Drawer>
      </Hidden>
      <Hidden only={['xs', 'sm', 'md']}>
        <Drawer
          variant="permanent"
          classes={{ root: classes.drawerContainer, paper: classes.drawer }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={() => history.push('/')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {t('reportTitle')}
            </Typography>
          </div>
          <Divider />
          <SideNav routes={routes} />
        </Drawer>
      </Hidden>
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container direction="column" spacing={2}>
          <Grid item>{filter}</Grid>
          <Grid item>{children}</Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ReportLayout;
