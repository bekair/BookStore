import * as React from 'react';
import { Avatar, Theme, withStyles, WithStyles, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import SchoolIcon from '@material-ui/icons/School';
import AndroidIcon from '@material-ui/icons/Android';
import TheatersIcon from '@material-ui/icons/Theaters';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import HistoryIcon from '@material-ui/icons/History';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import AdbIcon from '@material-ui/icons/Adb';

export interface FilterProps extends WithStyles<any> {
}

export interface FilterState {
    age: any
}

const styles = (theme: Theme) => ({
    grid: {
        margin: theme.spacing.unit * 2
    },
    avatar: {
        width: 50,
        height: 50,
        backgroundColor: '#66bb6a',
        color: '#fff',
        fontWeight: 'bold',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120
    },
} as Record<string, CSSProperties>);

class Filter extends React.Component<FilterProps & WithStyles<any>, FilterState> {
    constructor(props: FilterProps) {
        super(props);

        this.state = {
            age: null
        }
    }

    handleChange = (event: any) => {
        this.setState({ age: event.target.value });
    };

    public render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container justify="center" alignItems="center">
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <SchoolIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Science
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <AndroidIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Sci-Fi
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <TheatersIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Drama
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <SentimentVerySatisfiedIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Comedy
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <LocalLibraryIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Classic
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <AdbIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Fantasy
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <FlashOnIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            Horror
                        </Typography>
                    </Grid>
                    <Grid item className={classes.grid}>
                        <Avatar className={classes.avatar}>
                            <HistoryIcon />
                        </Avatar>
                        <Typography variant="overline" align={"justify"}>
                            History
                        </Typography>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Filter) as any;