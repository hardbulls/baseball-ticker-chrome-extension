import { useCallback, useEffect, useState } from "react";
import { CONFIG } from "./config";
import { OptionsState } from "./options/OptionsState";

type Props = {
  sponsors: string[],
  options: OptionsState
}

export const Sponsors = ({ options, sponsors }: Props) => {
  const getRandomSponsor = useCallback(() => sponsors[Math.floor(Math.random() * sponsors.length)], [sponsors]);
  const [currentSponsor, setCurrentSponsor] = useState<string>(getRandomSponsor());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSponsor(getRandomSponsor);
    }, CONFIG.sponsorInterval);

    return () => clearInterval(intervalId);
  }, [sponsors, getRandomSponsor, setCurrentSponsor]);

  const backgroundGradient = options.background1;
  const layoutGradient = options.background2;

  return (<div style={{
    height: "208px",
    width: "340px",
    border: `${CONFIG.borderSize} solid ${CONFIG.borderColor}`,
    background: `linear-gradient(${backgroundGradient.angle}deg, ${backgroundGradient.startColor}ff ${backgroundGradient.startPercentage}%, ${backgroundGradient.endColor}ff ${backgroundGradient.endPercentage}%)`,
    display: "flex",
    flexDirection: "column"
  }}>
    <div style={{
      background: `linear-gradient(${layoutGradient.angle}deg, ${layoutGradient.startColor}ff ${layoutGradient.startPercentage}%, ${layoutGradient.endColor}ff ${layoutGradient.endPercentage}%)`,
      fontFamily: `${options.font.name}`,
      color: `${options.fontColor2}`,
      fontSize: "24px",
      textAlign: "center"
    }}>
      Hard Bulls are sponsored by
    </div>
    <div style={{display: "flex", justifyContent: "center", height: `calc(208px - 34px - ${CONFIG.borderSize})`, padding: CONFIG.borderSize }}>
      <img src={currentSponsor} alt="Sponsor" style={{
        objectFit: "contain",
        backgroundColor: "#ffffff",
        height: "100%",
        width: "100%"
      }} />
    </div>
  </div>);
};
