import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#83c5be',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 25
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    titulo: {
        fontSize: 20,
        lineHeight: 24,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 37
    },
    opcoes: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    botoes: {
        backgroundColor: "#8F8FBD",
        paddingVertical: 7,
        color: "#FFFFFF",
        borderRadius: 20,
        textAlign: "center",
        alignItems: "center",
        marginHorizontal: 20,
        paddingHorizontal: 30
    },
    textos: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "400",
    },
});

export default style;
