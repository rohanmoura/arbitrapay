import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  safe:{
    flex:1,
    backgroundColor:"#0B1220"
  },

  container:{
    paddingHorizontal:20
  },

  header:{
    flexDirection:"row",
    alignItems:"center",
    gap:12,
    marginTop:10,
    marginBottom:30
  },

  backBtn:{
    width:36,
    height:36,
    borderRadius:10,
    backgroundColor:"#111827",
    justifyContent:"center",
    alignItems:"center"
  },

  title:{
    color:"#fff",
    fontSize:22,
    fontWeight:"700"
  },

  card:{
    backgroundColor:"#111827",
    borderRadius:18,
    padding:20
  },

  iconBox:{
    width:60,
    height:60,
    borderRadius:16,
    backgroundColor:"#0B1220",
    justifyContent:"center",
    alignItems:"center",
    marginBottom:16
  },

  heading:{
    color:"#fff",
    fontSize:17,
    fontWeight:"600",
    marginBottom:6
  },

  desc:{
    color:"#9CA3AF",
    fontSize:13,
    marginBottom:22
  },

  toggleRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center"
  },

  toggleText:{
    color:"#fff",
    fontSize:15
  }

});