export default {
  safeAreaStyles: {
    flex: 1,
    flexDirection: 'column'
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    flex: 1,
    flexDirection: 'column'
  },
  titleBar: {
    height: 30,
    alignItems: 'center'
  },
  headerTitle: {

  },
  mainVideoBox: {
    flex: 4,
    borderRadius:15,
    backgroundColor: '#DFDFDF',
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },
  playerNameBox: {
    position: 'absolute',
    backgroundColor: 'red',
    color: 'white',
    marginTop:10,
    paddingLeft:10,
    paddingRight:10,
    fontSize: 16,
    borderRadius:10,
    overflow: "hidden",
    fontWeight: "bold",
    zIndex: 2
  },
  smallVideoBox: {
    width: 120,
    height: 180,
    borderRadius:10,
    backgroundColor: '#ADADAD',
    position: "absolute",
    bottom: 10,
    right: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden'
  },

  startPlayButton: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "red", 
    position: "absolute", 
    bottom: 10, 
    left: '50%', 
    marginLeft: -30
  },
  stopPlayButton: {
    width: 40, 
    height: 40, 
    borderRadius: 0, 
    backgroundColor: "red", 
    position: "absolute", 
    bottom: 30, 
    left: '50%', 
    marginLeft: -30
  },
  bottomBox: {
    flex: 1,
  },
  remoteGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    zIndex: 0,
    position: 'relative'
  },

  localVideo: {
    width: 120,
    height: 180,
    backgroundColor: 'black',
    position: 'absolute'
  },
};