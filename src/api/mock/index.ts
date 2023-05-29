import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import completeGuide from './completeGuide';
import gameStart from './gameStart';
import gameSubmit from './gameSubmit';
import gameReborn from './gameReborn';
import getQuestion from './getQuestion';
import chooseSubmit from './chooseSubmit';
import completeTask from './completeTask';
import taskList from './taskList';
import readIndex from './readIndex';
import receiveTaskPrize from './receiveTaskPrize';

import healthInfoDetail from './healthInfoDetail';
import healthInfoComplete from './healthInfoComplete';
import healthInfoIndex from './healthInfoIndex';

export const addMock = (APIPath :any) => {
    const mock = new MockAdapter(axios);
    mock.onGet(APIPath.getQuestion).reply(200, getQuestion);
    mock.onGet(APIPath.healthInfoIndex).reply(200, healthInfoIndex);
    mock.onGet(APIPath.chooseSubmit).reply(200, chooseSubmit);
    mock.onGet(APIPath.completeGuide).reply(200, completeGuide);
    mock.onGet(APIPath.gameStart).reply(200, gameStart);
    mock.onGet(APIPath.gameSubmit).reply(200, gameSubmit);
    mock.onGet(APIPath.gameReborn).reply(200, gameReborn);

    mock.onGet(APIPath.detail).reply(200, healthInfoDetail);
    mock.onGet(APIPath.healthInfoComplete).reply(200, healthInfoComplete);


    mock.onGet(APIPath.taskList).reply(200, taskList);
    mock.onGet(APIPath.completeTask).reply(200, completeTask);
    mock.onGet(APIPath.readIndex).reply(200, readIndex);
    mock.onGet(APIPath.receiveTaskPrize).reply(200, receiveTaskPrize);

}