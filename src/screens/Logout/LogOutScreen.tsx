import { CommonActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import style from './Styles';

export default function LogOutScreen() {
    const navigation = useNavigation();

    function sair() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignTabs' }],
            })
        );
    }

    return (
        <>
            <View style={style.body}>
                <View style={style.container}>
                    <Text style={style.titulo}>Deseja sair da conta?</Text>
                    <View style={style.opcoes}>
                        <TouchableOpacity style={style.botoes} onPress={() => { sair() }}>
                            <Text style={style.textos}>Sim</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={style.botoes} onPress={() => { navigation.goBack() }}>
                            <Text style={style.textos}>Não</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )

}