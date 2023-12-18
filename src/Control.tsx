import { BaseEnum } from "./baseball/model/BasesEnum";
import { InningHalfEnum } from "./baseball/model/InningHalfEnum";
import { ScoreboardState } from "./baseball/model/ScoreboardState";
import Grid2 from "@mui/material/Unstable_Grid2";
import { HomeAwayEnum } from "./baseball/model/HomeAwayEnum";

import Button from "@mui/material/Button";
import { amber, deepPurple, green, grey, indigo, pink, red } from "@mui/material/colors";

interface Props {
  scoreboard: ScoreboardState;
  handleScoreChange: (team: HomeAwayEnum, value: number) => void;
  handleBaseChange: (base: BaseEnum, value: boolean) => void;
  handleInningChange: (half: InningHalfEnum, value: number) => void;
  handleOutClick: () => void;
  handleStrikeClick: () => void;
  handleBallClick: () => void;
  handleResetCountClick: () => void;
  handleClearBases: () => void;
}

export const Control = ({
                          scoreboard,
                          handleStrikeClick,
                          handleBallClick,
                          handleOutClick,
                          handleScoreChange,
                          handleBaseChange,
                          handleInningChange,
                          handleClearBases,
                          handleResetCountClick
                        }: Props) => {

  const onInningChange = (value: number) => {
    if (value < 0) {
      if (scoreboard.inning.half === InningHalfEnum.TOP) {
        handleInningChange(InningHalfEnum.BOTTOM, Math.max(1, scoreboard.inning.value - 1));

        return;
      }

      if (scoreboard.inning.half === InningHalfEnum.BOTTOM) {
        handleInningChange(InningHalfEnum.TOP, Math.max(1, scoreboard.inning.value));

        return;
      }
    }

    if (scoreboard.inning.half === InningHalfEnum.TOP) {
      handleInningChange(InningHalfEnum.BOTTOM, Math.max(1, scoreboard.inning.value));

      return;
    }

    if (scoreboard.inning.half === InningHalfEnum.BOTTOM) {
      handleInningChange(InningHalfEnum.TOP, Math.max(1, scoreboard.inning.value + 1));

      return;
    }
  };

  const onBaseChange = (base: BaseEnum) => {
    handleBaseChange(base, !scoreboard.bases.includes(base));
  };

  const buttonStyle = {
    fontSize: '18px',
    height: '100%',
    minHeight: '64px',
  }

  const BaseButton = ({base}: {base: BaseEnum}) => {
    return (
    <Button
      fullWidth
      style={buttonStyle}
      onClick={() => onBaseChange(base)}
      variant="contained"
      sx={{
        p: 4,
        borderRadius: 0,
        backgroundColor: scoreboard.bases.includes(base) ? amber["500"] : grey['500'],
        "&:hover": {
          backgroundColor: scoreboard.bases.includes(base) ? amber["600"] : grey['600'],
        }
      }}
    >
      {base}. Base
    </Button>
    )
  }


  return (
    <>
      <Grid2 container >
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleScoreChange(HomeAwayEnum.HOME, Math.max(0, scoreboard.score[0] + 1))}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              backgroundColor: green["500"],
              "&:hover": {
                backgroundColor: green['600']
              }
            }}
          >
            Home +
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleScoreChange(HomeAwayEnum.HOME, Math.max(0, scoreboard.score[0] - 1))}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              height: '100%',
              backgroundColor: pink["500"],
              "&:hover": {
                backgroundColor: pink['600']
              }
            }}
            disabled={scoreboard.score[0] === 0}
          >
            Home -
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleScoreChange(HomeAwayEnum.AWAY, Math.max(0, scoreboard.score[1] + 1))}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              backgroundColor: green["500"],
              "&:hover": {
                backgroundColor: green['600']
              }
            }}
          >
            Away +
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleScoreChange(HomeAwayEnum.AWAY, Math.max(0, scoreboard.score[1] - 1))}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              height: '100%',
              backgroundColor: pink["500"],
              "&:hover": {
                backgroundColor: pink['600']
              }
            }}
            disabled={scoreboard.score[1] === 0}
          >
            Away -
          </Button>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 xs={4}>
          <BaseButton base={BaseEnum.FIRST}/>
        </Grid2>
        <Grid2 xs={4}>
          <BaseButton base={BaseEnum.SECOND}/>
        </Grid2>
        <Grid2 xs={4}>
          <BaseButton base={BaseEnum.THIRD}/>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 xs={4}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleStrikeClick()}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              backgroundColor: deepPurple["500"],
              "&:hover": {
                backgroundColor: deepPurple['600']
              }
            }}
          >
            Strike
          </Button>
        </Grid2>
        <Grid2 xs={4}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleBallClick()}
            variant="contained"
            sx={{
              borderRadius: 0,
              backgroundColor: indigo["500"],
              "&:hover": {
                backgroundColor: indigo['600']
              }
            }}
          >
            Ball
          </Button>
        </Grid2>
        <Grid2 xs={4}>
          <Button
            fullWidth
            onClick={() => handleOutClick()}
            style={buttonStyle}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
              backgroundColor: red["500"],
              "&:hover": {
                backgroundColor: red['600']
              }
            }}
          >
            Out
          </Button>
        </Grid2>
      </Grid2>

      <Grid2 container>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => onInningChange(1)}
            variant="contained"
            sx={{
              p: 4,
              borderRadius: 0,
            }}
          >
            Inning +
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => onInningChange(-1)}
            variant="contained"
            disabled={scoreboard.inning.value === 1 && scoreboard.inning.half === InningHalfEnum.TOP}
            sx={{
              borderRadius: 0,
              p: 4,
            }}
          >
            Inning -
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleClearBases()}
            variant="contained"
            disabled={scoreboard.bases.length === 0}
            sx={{
              borderRadius: 0,
              p: 4,
            }}
          >
            Reset Bases
          </Button>
        </Grid2>
        <Grid2 xs={3}>
          <Button
            fullWidth
            style={buttonStyle}
            onClick={() => handleResetCountClick()}
            variant="contained"
            disabled={scoreboard.balls === 0 && scoreboard.strikes === 0}
            sx={{
              borderRadius: 0,
              p: 4,
            }}
          >
            Reset Count
          </Button>
        </Grid2>
      </Grid2>
    </>
  );
};
