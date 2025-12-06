import { ScrollView, Text } from "react-native";

export default function BasketballModule2() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 2 – Player Development</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Skill Categories</Text>
      <Text>
        • Ball handling{"\n"}
        • Shooting mechanics{"\n"}
        • Passing{"\n"}
        • Footwork{"\n"}
        • Finishing at the rim
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Athletic Development</Text>
      <Text>
        • Strength{"\n"}
        • Speed{"\n"}
        • Agility{"\n"}
        • Balance{"\n"}
        • Conditioning
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>IQ Development</Text>
      <Text>
        • Reading defenses{"\n"}
        • Reading screens{"\n"}
        • Shot selection{"\n"}
        • Court vision
      </Text>
    </ScrollView>
  );
}
