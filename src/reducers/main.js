import { SET_MAIN } from '../config/constants'

const main = (state = {}, action) => {
  switch (action.type) {
    case SET_MAIN:
      return { ...state, ...action.main };
    default:
      return state;
  }
}

export default main;
