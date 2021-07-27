import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        width: '100%',
        paddingRight: '10px',
        paddingLeft: '10px'
    },
    welcomediv: {
        backgroundImage: 'linear-gradient(to left, rgb(0, 162, 255,0.5), rgb(0, 162, 255,1))',
        borderRadius: '15px',
        padding: '8%',
        margin: '15px auto'
    }
})

const HomePage = () => {
    const classes = useStyles();

    return (
        <Container 
            maxWidth="xl"
            className={classes.root}
        >
            <Container className={classes.welcomediv}>
                <Typography
                    variant="h4"
                    align="center"
                >
                    Welcome to the Droom Interview Test System!
                </Typography>
            </Container>
        </Container>
     );
}
export default HomePage