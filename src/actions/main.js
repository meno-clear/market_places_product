import { SET_MAIN } from '../config/constants'

function setMain(main) {
  return { type: SET_MAIN, main: main }
}

export default setMain;
