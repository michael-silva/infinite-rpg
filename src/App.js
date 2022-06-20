import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Drawer,
  Grid,
  Hidden,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useState, useEffect, useMemo } from "react";
import { Person, humanRace } from "./persons";
import { humanCity, northRegion, southRegion, WorldMap } from "./world";
import { Calendar } from "./rpg";
import "./styles.css";

const calendar = new Calendar();
const worldMap = new WorldMap({});
worldMap.regions.push(northRegion);
// worldMap.regions.push(southRegion);

const RegionUI = ({ region, onClick }) => {
  return (
    <Card>
      <CardHeader title={region.name} subheader={region.currentSeason.name} />
      <CardContent>
        <Typography color="text.secondary">Climate:</Typography>
        <Typography variant="body2">{region.climateEvent?.name}</Typography>
        <Divider style={{ margin: "5px 0" }} />
        <Typography color="text.secondary">Weather:</Typography>
        <Typography variant="body2">
          {region.currentWeather.temperature} C* |
          {region.currentWeather.cloudy?.toFixed(1)} cdy |
          {region.currentWeather.humidity?.toFixed(1)} hmt |
          {region.currentWeather.wind?.toFixed(1)} wind
        </Typography>
        <Divider style={{ margin: "5px 0" }} />
        <Typography color="text.secondary">Fauna:</Typography>
        <Typography variant="body2">{region.fauna}</Typography>
        <Divider style={{ margin: "5px 0" }} />
        <Typography color="text.secondary">Flora:</Typography>
        <Typography variant="body2">{region.flora}</Typography>
        <Divider style={{ marginTop: 5 }} />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onClick(region)}>
          Enter
        </Button>
      </CardActions>
    </Card>
  );
};

const PersonUI = ({ person, player }) => {
  return (
    <Card>
      <Hidden smDown>
        <CardHeader
          avatar={<Avatar>{person.name[0]}</Avatar>}
          title={person.name}
          subheader={`age: ${person.age} | height: ${person.height}cm | weight: ${person.weight}kg`}
        />
      </Hidden>
      <Hidden smUp>
        <CardHeader
          title={person.name}
          subheader={`${person.age}'s old | ${person.height}cm | ${person.weight}kg`}
        />
      </Hidden>
      <CardContent>
        <Typography color="text.secondary">Location:</Typography>
        <Typography variant="body2">{person.currentLocation || "-"}</Typography>
        <Divider style={{ margin: "5px 0" }} />
        <Typography color="text.secondary">Action:</Typography>
        <Typography variant="body2">{person.currentAction || "-"}</Typography>
        <Divider style={{ margin: "5px 0" }} />
        <Typography color="text.secondary">Talk:</Typography>
        <Typography variant="body2">{person.talkText}</Typography>
        <Divider style={{ marginTop: 5 }} />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => person.talkTo(player)}>
          Talk
        </Button>
      </CardActions>
    </Card>
  );
};

const PlayerUI = ({ person, onChange }) => {
  const handleChange = ({ target }) => {
    onChange(new Person({ ...person, [target.id]: target.value }));
  };
  const handleNumberChange = ({ target }) => {
    onChange(new Person({ ...person, [target.id]: Number(target.value) }));
  };
  return (
    <>
      <Typography variant="h6">{person.name}</Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 5 }}
      >{`age: ${person.age} | height: ${person.height}cm | weight: ${person.weight}kg`}</Typography>
      <Box m={-1} component="form" noValidate autoComplete="off">
        <TextField
          id="name"
          label="Name"
          variant="outlined"
          value={person.name}
          onChange={handleChange}
          sx={{ m: 1, width: "25ch" }}
        />

        <TextField
          id="age"
          label="Years Age"
          variant="outlined"
          value={person.age}
          type="number"
          sx={{ m: 1, width: "25ch" }}
          onChange={handleNumberChange}
        />
        <TextField
          label="Height"
          variant="outlined"
          id="height"
          value={person.height}
          onChange={handleNumberChange}
          type="number"
          sx={{ m: 1, width: "25ch" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">cm</InputAdornment>
          }}
        />
        <TextField
          id="weight"
          label="Weight"
          variant="outlined"
          value={person.weight}
          onChange={handleNumberChange}
          type="number"
          sx={{ m: 1, width: "25ch" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>
          }}
        />
      </Box>
    </>
  );
};

export default function App() {
  const [ticks, setTicks] = useState(0);
  const map = useMemo(() => worldMap);
  // const [player, setPlayer] = useState(() => humanRace.generatePerson());
  // const [persons, setPersons] = useState([]);

  /* const handleGenerate = () => {
    setPersons((p) => [...p, humanRace.generatePerson({ city: humanCity })]);
  };*/

  const handleTick = useCallback(() => {
    calendar.update();
    map.update(calendar);
    // persons.forEach((person) => person.update(calendar));
    setTicks(ticks + 1);
  }, [map, ticks]);

  useEffect(() => {
    const timeout = setTimeout(handleTick, 1000);
    return () => clearTimeout(timeout);
  }, [handleTick]);

  return (
    <Box className={map.isNight() ? "root is-night" : "root"}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5">
            day: {calendar.day} | time: {calendar.hour}:00 | sun [
            {map.sun.position.map((pos) => pos.toFixed(1)).join(", ")}]
          </Typography>
        </Grid>
        {map.regions.map((region, i) => (
          <Grid key={i} item xs={6}>
            <RegionUI region={region} />
          </Grid>
        ))}
        {/*<Grid item xs={12}>
        <PlayerUI person={player} onChange={setPlayer} />
        <Button onClick={handleGenerate}>Generate NPC</Button>
      </Grid>
      {persons.map((person, i) => (
        <Grid key={i} item xs={6}>
          <PersonUI person={person} player={player} />
        </Grid>
      ))}
      */}
      </Grid>
    </Box>
  );
}
