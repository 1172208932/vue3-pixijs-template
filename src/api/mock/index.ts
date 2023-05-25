import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import parkour from './parkour';
import completeGuide from './completeGuide';

export const addMock = (APIPath) => {
    const mock = new MockAdapter(axios);
    mock.onGet(APIPath.getInfo).reply(200, parkour);
    mock.onGet(APIPath.completeGuide).reply(200, completeGuide);

}