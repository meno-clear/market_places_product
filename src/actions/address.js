import { SET_ADDRESS } from '../config/constants'

export function setAddress(location) {
  return { type: SET_ADDRESS, address: {latitude: location.lat, longitude: location.lng} }
}
