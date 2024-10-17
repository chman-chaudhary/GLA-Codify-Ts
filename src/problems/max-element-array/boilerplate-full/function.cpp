#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <climits>

USER_CODE_HERE

int main() {
  int num1 = stoi(input_0);
  int num2 = stoi(input_1);
  int result = TwoSum(num1, num2);
  std::cout << result << std::endl;
  return 0;
}