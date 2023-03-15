import { SET_ADDRESS } from '../config/constants'

const address = (state = {}, action) => {
  switch (action.type) {
    case SET_ADDRESS:
      return { ...state, ...action.address };
    default:
      return state;
  }
}

export default address;
