import { Colors } from "@/src/shared/constants/Colors";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  trigger: {
    height: 50,
    padding: 12,
    width: "100%",
    justifyContent: "space-between",
  },
  input: {
    color: Colors.BLACK,
    fontSize: 16,
    width: '90%'
  },
  loadingIcon: {
    marginRight: 8,
  },
  content: {
    maxHeight: 450,
    backgroundColor: Colors.WHITE,
  },
  searchInput: {
    width: "100%",
  },
  listContainer: {
    gap: 16,
    paddingVertical: 8,
  },
  item: {
    backgroundColor: "transparent",
  },
  footer: {
    padding: 10,
  },
  empty: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;