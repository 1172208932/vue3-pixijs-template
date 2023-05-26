import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import completeGuide from './completeGuide';
import gameStart from './gameStart';
import gameSubmit from './gameSubmit';
import gameReborn from './gameReborn';
import getQuestion from './getQuestion';


import healthInfoDetail from './healthInfoDetail';
import healthInfoComplete from './healthInfoComplete';
import healthInfoIndex from './healthInfoIndex';

export const addMock = (APIPath :any) => {
    const mock = new MockAdapter(axios);
    mock.onGet(APIPath.healthInfoIndex).reply(200, healthInfoIndex);
    mock.onGet(APIPath.completeGuide).reply(200, completeGuide);
    mock.onGet(APIPath.gameStart).reply(200, gameStart);
    mock.onGet(APIPath.gameSubmit).reply(200, gameSubmit);
    mock.onGet(APIPath.gameReborn).reply(200, gameReborn);

    mock.onGet(APIPath.healthInfoDetail).reply(200, healthInfoDetail);
    mock.onGet(APIPath.healthInfoComplete).reply(200, healthInfoComplete);
    mock.onGet(APIPath.getQuestion).reply(200, getQuestion);

}