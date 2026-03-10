import Carousel from "react-native-reanimated-carousel";
import { View, Image, Dimensions } from "react-native";

const width = Dimensions.get("window").width;

const banners = [
  require("@/assets/banners/banner1.png"),
  require("@/assets/banners/banner2.png"),
  require("@/assets/banners/banner3.png"),
];

export default function BannerSlider() {
  return (
    <View style={{ marginVertical: 16 }}>
      <Carousel
        width={width - 32}
        height={150}
        data={banners}
        autoPlay
        autoPlayInterval={4000}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 16,
            }}
            resizeMode="cover"
          />
        )}
      />
    </View>
  );
}