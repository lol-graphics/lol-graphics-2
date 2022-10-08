import { useCallback, useState } from "react";
import { Row, Col, ButtonGroup } from "reactstrap";
import {toast} from 'react-toastify';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { GetSummoner } from "@Hooks/api";
import { InsertSummoner } from "@Hooks/api";
import { SummonerData } from "@Interfaces/index";
 
export default function SearchSummoner(): JSX.Element {
  const [summoner, setSummoner] = useState<string>("");
  const [summonerData, setSummonerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);

    const {data: { puuid, name, profileIconId, summonerLevel }} = await GetSummoner(summoner);

    const img = `${process.env.REACT_APP_URL_IMG}/img/profileicon/${profileIconId}.png`;

    setSummonerData({
      puuid,
      name,
      profileIconId,
      summonerLevel,
      img,
    });
    setIsLoading(false);
  }, [summoner, isLoading]);

  const handleInsertSumonner = useCallback(async () => {
    setIsSaving(true);
    const summonerObj: SummonerData = {
      puuid: summonerData.puuid,
      name: summonerData.name,
    };

    await InsertSummoner(summonerObj)
    .then(res => toast.success(res.data.message))
    .catch((err : any) => toast.error(err.response.data));

    setIsLoading(false);
    setSummonerData(null);
    setIsSaving(false);
  }, [summonerData, isLoading, setIsLoading, isSaving]);

  return (
      <div className="vh-100 w-100 d-flex align-items-center justify-content-center">
        <div className="d-flex justify-content-center align-items-center">
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            onChange={(e) => setSummoner(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            variant="contained"
            className="p-3 rounded-0"
            disabled={!!summonerData}
          >
            {isLoading ? "loading..." : "Search"}
          </Button>
        </div>
        {summonerData && (
          <Row>
            <Col>
              <img src={summonerData.img} />
            </Col>
            <Col className="d-flex flex-column">
              <span> {summonerData.name}</span>
              <span> {summonerData.summonerLevel}</span>
            </Col>
            <Col className="d-flex flex-column">
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                <span>Este é você?</span>
                <ButtonGroup>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {setSummonerData(null); setIsLoading(false);}}
                  >
                    Não
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleInsertSumonner}
                  >
                    Sim
                  </Button>
                </ButtonGroup>
                </>
              )}
            </Col>
          </Row>
        )}
      </div>
  );
}
