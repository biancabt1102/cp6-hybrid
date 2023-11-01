import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#83c5be',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 25
  },
  title: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
  },
  field: {
    backgroundColor: '#edf6f9',
    marginTop: 25,
    width: 308,
    paddingVertical: 22,
    paddingLeft: 45,
    fontWeight: '600',
    fontSize: 20,
    borderRadius: 5,
  },
  boton: {
    marginTop: 10,
    backgroundColor: '#006d77',
    width: 308,
    paddingVertical: 20,
    borderRadius: 10,
  },
  textBoton: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  },
  container: {
    marginTop: 15,
    padding: 10,
  },
  form: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
  },
  currentUserText: {
    color: 'green',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default style;
